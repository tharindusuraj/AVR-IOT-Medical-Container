#include <stdio.h>

#include "GPS.h"

char location[25];

int GPS_Read() {
    char gps_rx_read[40];
    int char_index = 0;
    
    int gps_fix;
    
    //Read incoming GPS data and filter GPGGA readings---------------------------------------
    for(int i=0; i<10000; i++){
            if (USART1_Read() == '$'){
                if (USART1_Read() == 'G'){
                    if (USART1_Read() == 'P'){
                        if (USART1_Read() == 'G'){
                            if (USART1_Read() == 'G'){
                                if (USART1_Read() == 'A'){
                                   if (USART1_Read() == ','){ 
                                        for (int i=0;i<40;i++){
                                            gps_rx_read[char_index] = USART1_Read();
                                            char_index++;
                                         }
                                        break;
                                   }
                                }
                            }
                        }
                    }
                }
            }    
            //160159.00,0702.13475,N,07959.10053,E,1,01??'??u?

    }
    
    //decode GPS reading---------------------------------------------------------------
    //https://shekharbiradar.wordpress.com/decoding-gps-gpgga/
    
    if (gps_rx_read[21] == 'N') location[0] = '+';
    else location[0] = '-';
    
    location[1] = gps_rx_read[10];
    location[2] = gps_rx_read[11];
    location[3] = '.';
    location[4] = gps_rx_read[12];
    location[5] = gps_rx_read[13];
    location[6] = gps_rx_read[15];
    location[7] = gps_rx_read[16];
    location[8] = gps_rx_read[17];
    location[9] = gps_rx_read[18];
    
    location[10] = ',';
    
        
    if (gps_rx_read[35] == 'E') location[11] = '+';
    else location[11] = '-';
    location[12] = gps_rx_read[23];
    location[13] = gps_rx_read[24];
    location[14] = gps_rx_read[25];
    location[15] = '.';
    location[16] = gps_rx_read[26];
    location[17] = gps_rx_read[27];
    location[18] = gps_rx_read[29];
    location[19] = gps_rx_read[30];
    location[20] = gps_rx_read[31];
    location[21] = gps_rx_read[32];
    
    //check the gps status
    int first_char = (int)gps_rx_read[10]- 47;
    if (first_char > 0 & first_char < 10) gps_fix = 1;        // 0 - invalid    1- GPS fix
    else    gps_fix = 0;
    //printf("gps fix - %d \n",gps_fix);
    
    return gps_fix;
}

