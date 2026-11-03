// Balloone G5 — bancada Wi-Fi; MOTOR FISICO DESABILITADO.
// ESP32 Arduino core 3.x; WebSocketsServer (Links2004); AI Thinker ESP32-CAM.
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <esp_camera.h>
#include <esp_http_server.h>
#include <esp_system.h>
#include <ctype.h>
#include <stdlib.h>
#include <string.h>

#ifndef BALLOONE_AP_PASSWORD
#define BALLOONE_AP_PASSWORD "ALTERE_SENHA_FORTE_2026"
#endif
#ifndef BALLOONE_CONTROL_TOKEN
#define BALLOONE_CONTROL_TOKEN "ALTERE_TOKEN_LONGO_2026"
#endif
static const char* SSID="BALLOONE_G5";
static constexpr uint32_t TIMEOUT_MS=350; // Provisorio; nao validado.
static constexpr uint8_t NO_OWNER=255;
WebSocketsServer ws(81);
httpd_handle_t streamServer=nullptr;
uint8_t owner=NO_OWNER;
uint32_t lastRx=0,lastSeq=0;
bool hasSeq=false,armed=false;
char desired[8]="STOP";
// Camera AI Thinker
#define PWDN_GPIO_NUM 32
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM 0
#define SIOD_GPIO_NUM 26
#define SIOC_GPIO_NUM 27
#define Y9_GPIO_NUM 35
#define Y8_GPIO_NUM 34
#define Y7_GPIO_NUM 39
#define Y6_GPIO_NUM 36
#define Y5_GPIO_NUM 21
#define Y4_GPIO_NUM 19
#define Y3_GPIO_NUM 18
#define Y2_GPIO_NUM 5
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM 23
#define PCLK_GPIO_NUM 22

// A implementacao fisica deve impor parada no driver por mecanismo independente
// e supervisionar seu proprio timeout. Nenhum pino de motor e acionado aqui.
void applyMotor(const char* cmd) {
  if(strcmp(desired,cmd)!=0) Serial.printf("MOTOR_SIMULADO=%s\n",cmd);
  snprintf(desired,sizeof(desired),"%s",cmd);
}
void stopSafe(){applyMotor("STOP");armed=false;}
void resetSession(){stopSafe();owner=NO_OWNER;hasSeq=false;lastSeq=0;lastRx=0;}
void sendError(uint8_t client,const char* error){ws.sendTXT(client,error);}

void onWs(uint8_t client,WStype_t type,uint8_t* payload,size_t len){
  if(type==WStype_DISCONNECTED){if(owner==client)resetSession();return;}
  if(type!=WStype_TEXT)return;
  // formato: TOKEN,SEQ,CMD (sem espacos), limite fixo.
  if(len<5 || len>110){sendError(client,"ERR:FORMAT");return;}
  char msg[112];memcpy(msg,payload,len);msg[len]='\0';
  char* c1=strchr(msg,',');if(!c1){sendError(client,"ERR:FORMAT");return;}
  *c1='\0';char* c2=strchr(c1+1,',');if(!c2){sendError(client,"ERR:FORMAT");return;}
  *c2='\0';const char* token=msg;const char* seqText=c1+1;const char* cmd=c2+1;
  if(strchr(cmd,',') || strcmp(token,BALLOONE_CONTROL_TOKEN)!=0){sendError(client,"ERR:AUTH_OR_FORMAT");return;}
  if(owner!=NO_OWNER && owner!=client){sendError(client,"ERR:BUSY");return;}
  size_t digits=strlen(seqText);
  if(digits==0 || digits>10){sendError(client,"ERR:SEQ");return;}
  for(size_t i=0;i<digits;i++)if(!isdigit((unsigned char)seqText[i])){sendError(client,"ERR:SEQ");return;}
  char* end=nullptr;unsigned long long parsed=strtoull(seqText,&end,10);
  if(*end!='\0' || parsed>UINT32_MAX){sendError(client,"ERR:SEQ");return;}
  uint32_t seq=(uint32_t)parsed;
  if(strcmp(cmd,"STOP") && strcmp(cmd,"FWD") && strcmp(cmd,"BACK") && strcmp(cmd,"LEFT") && strcmp(cmd,"RIGHT")){sendError(client,"ERR:CMD");return;}
  if(hasSeq && (int32_t)(seq-lastSeq)<=0){sendError(client,"ERR:STALE");return;}
  // Somente STOP autenticado pode adquirir uma sessao nova.
  if(owner==NO_OWNER && strcmp(cmd,"STOP")){sendError(client,"ERR:NEED_STOP");return;}
  owner=client;lastSeq=seq;hasSeq=true;lastRx=millis();
  if(!armed){if(strcmp(cmd,"STOP")){sendError(client,"ERR:NEED_STOP");return;}armed=true;}
  applyMotor(cmd);
  char reply[64];snprintf(reply,sizeof(reply),"ACK:%lu:%lu:%s",(unsigned long)seq,(unsigned long)millis(),desired);
  ws.sendTXT(client,reply);
}

esp_err_t streamHandler(httpd_req_t* req){
  httpd_resp_set_type(req,"multipart/x-mixed-replace;boundary=frame");
  // Video nao autenticado: rede AP privada e isolamento fisico sao obrigatorios.
  while(true){
    camera_fb_t* fb=esp_camera_fb_get();if(!fb)return ESP_FAIL;
    char header[100];int n=snprintf(header,sizeof(header),"--frame\r\nContent-Type: image/jpeg\r\nContent-Length: %u\r\n\r\n",(unsigned)fb->len);
    esp_err_t e=httpd_resp_send_chunk(req,header,n);
    if(e==ESP_OK)e=httpd_resp_send_chunk(req,(const char*)fb->buf,fb->len);
    if(e==ESP_OK)e=httpd_resp_send_chunk(req,"\r\n",2);
    esp_camera_fb_return(fb);
    if(e!=ESP_OK)break;
    vTaskDelay(pdMS_TO_TICKS(70));
  }
  return ESP_OK;
}
void setup(){
  Serial.begin(115200);resetSession();
  if(strlen(BALLOONE_AP_PASSWORD)<8 || strstr(BALLOONE_AP_PASSWORD,"ALTERE_") || strstr(BALLOONE_CONTROL_TOKEN,"ALTERE_")){
    Serial.println("CONFIG_INSEGURA: configure senha e token no firmware antes de iniciar");return;
  }
  camera_config_t c={};c.ledc_channel=LEDC_CHANNEL_0;c.ledc_timer=LEDC_TIMER_0;
  c.pin_d0=Y2_GPIO_NUM;c.pin_d1=Y3_GPIO_NUM;c.pin_d2=Y4_GPIO_NUM;c.pin_d3=Y5_GPIO_NUM;
  c.pin_d4=Y6_GPIO_NUM;c.pin_d5=Y7_GPIO_NUM;c.pin_d6=Y8_GPIO_NUM;c.pin_d7=Y9_GPIO_NUM;
  c.pin_xclk=XCLK_GPIO_NUM;c.pin_pclk=PCLK_GPIO_NUM;c.pin_vsync=VSYNC_GPIO_NUM;c.pin_href=HREF_GPIO_NUM;
  c.pin_sccb_sda=SIOD_GPIO_NUM;c.pin_sccb_scl=SIOC_GPIO_NUM;c.pin_pwdn=PWDN_GPIO_NUM;c.pin_reset=RESET_GPIO_NUM;
  c.xclk_freq_hz=20000000;c.pixel_format=PIXFORMAT_JPEG;c.frame_size=FRAMESIZE_QVGA;c.jpeg_quality=16;c.fb_count=1;
  esp_err_t cameraResult=esp_camera_init(&c);
  if(cameraResult!=ESP_OK)Serial.printf("CAMERA_ERROR=0x%x\n",cameraResult);
  WiFi.mode(WIFI_AP);
  if(!WiFi.softAP(SSID,BALLOONE_AP_PASSWORD,6,0,1)){Serial.println("AP_ERROR");return;}
  Serial.print("IP=");Serial.println(WiFi.softAPIP());
  ws.begin();ws.onEvent(onWs);
  if(cameraResult==ESP_OK){httpd_config_t cfg=HTTPD_DEFAULT_CONFIG();cfg.server_port=80;cfg.stack_size=8192;
    if(httpd_start(&streamServer,&cfg)==ESP_OK){httpd_uri_t uri={};uri.uri="/stream";uri.method=HTTP_GET;uri.handler=streamHandler;
      if(httpd_register_uri_handler(streamServer,&uri)!=ESP_OK)Serial.println("STREAM_REGISTER_ERROR");}
  }
}
void loop(){
  // A parada precede o processamento de mensagens em caso de atraso.
  if(owner!=NO_OWNER && (uint32_t)(millis()-lastRx)>TIMEOUT_MS){
    resetSession();Serial.println("FAILSAFE_TIMEOUT");ws.disconnect();
  }
  ws.loop();delay(1);
}
