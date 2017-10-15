#include <stdio.h> 
#include <wiringPi.h>
#include <sys/time.h>
#include <sys/mman.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include "stdlib.h"

#define ST_BASE (0x3F003000)
#define TIMER_OFFSET (4)
const int IR_INPUT = 3;/* GPIO3*/
typedef int bool;

long long int low_high_list[1000];
int low_high_list_index = 0;

typedef enum code_wave {
	
	NOTHING = 0,
	LONG_SYNC_LOW,
	LONG_SYNC_HIGH,
	
	NORMAL_LOW,
	NORMAL_HIGH,
	NORMAL_LONG_HIGH,

} code_wave;


typedef enum code_statue {
	NO_PARSE = 0,
	PARSE_ONGOING,

} code_state;


static long long int  prev_timer, *timer; // 64 bit timer

//48bit makes 6bytes
char code_byte[10] = {0};
int code_bit_index = 0;


long long int get_timer_diff()
{
	long long int ret;
	ret =  *timer - prev_timer;
	prev_timer = *timer;
	return ret;
}

void parse_code_byte(int bit)
{
	int byte_index = code_bit_index  / 8;
	code_byte[byte_index] |=  (bit << (7 - ((code_bit_index - byte_index*8)%8)));
	code_bit_index++;
}


void flush_code_byte()
{
	code_bit_index = 0;
}

/* 48bit */
void parse_code_bit(code_wave wave, code_wave last_wave)
{
		static code_state cur_state = NO_PARSE;

		if (cur_state == NO_PARSE) {
			if (wave == LONG_SYNC_HIGH)
				if (last_wave == LONG_SYNC_LOW) {
					cur_state = PARSE_ONGOING;
					flush_code_byte();
					//printf("state change!\n");
				}
		} else {
			if ((wave == NORMAL_LONG_HIGH) && (last_wave == NORMAL_LOW)) {
				//get 1
				parse_code_byte(1);
				
			} else if ((wave == NORMAL_HIGH) && (last_wave == NORMAL_LOW)) {
				//get 0
				parse_code_byte(0);
				
			} else if ((wave < NORMAL_LOW) || (wave > NORMAL_LONG_HIGH)) {
				cur_state = NO_PARSE;
				flush_code_byte();
				//printf("state change back!\n");

			} else {
				;
			}
		
		}

}

void parse_code_wave(long long int time_diff, bool high)
{

		code_wave cur_wave_code;
		static code_wave last_wave_code = NOTHING;

		if ((time_diff > 4300) && (time_diff < 4800)) {
			if (high)
				cur_wave_code = LONG_SYNC_HIGH;
			else
				cur_wave_code = LONG_SYNC_LOW;

		} else if ((time_diff > 400) && (time_diff < 700)) {
			if (high) {
				cur_wave_code = NORMAL_HIGH;
				//printf("NORMAL_HIGH\n");
			} else {
				cur_wave_code = NORMAL_LOW;
				//printf("NORMAL_LOW\n");

			}
		}
		else if ((time_diff > 1500) && (time_diff < 1800)) {
			if (high) {
				cur_wave_code = NORMAL_LONG_HIGH;
				//printf("NORMAL_LONG_HIGH\n");
			}
		}
		else
			cur_wave_code = NOTHING;
			

		parse_code_bit(cur_wave_code, last_wave_code);
		last_wave_code = cur_wave_code;

}

static void ir_int(void) {
   
	//digitalRead(IR_INPUT);
	
	
	long long int time_diff = 0;
	time_diff =  get_timer_diff();
	
	
	/* for debug */
	//if (time_diff  > 3000) {
		low_high_list[low_high_list_index++] = time_diff;
		if (low_high_list_index == 1000)
			low_high_list_index = 0;
	//}
	//printf("%lld,", time_diff);
	
	
	
	//the last value is reversed from now's value to pass in parse_code_wave
	if (digitalRead(IR_INPUT)) {
		parse_code_wave(time_diff, 0);	
	} else {
		parse_code_wave(time_diff, 1);
	}

}





int gpio_init()
{
	/*
	 * wiringPiSetup()
	 * uses wiringPi's own pin numbers. This assigns the usable 8 GPIO pins as numbers 0 through 7 and is invariant to the Pi hardware revision.
	 * wiringPiSetupPhys()
	 * uses the P1 pin numbers 1 through 26.
	 * wiringPiSetupGpio ()
	 * uses the broadcom chip gpio pin numbers. Some of these do change between hardwar erevisions.
	*/
	
	if (wiringPiSetupGpio() < 0) {
      printf ("Unable to setup wiringPi\n");
      return 1;
	}
	
	if ( wiringPiISR(IR_INPUT, INT_EDGE_BOTH, &ir_int) < 0 ) {
      printf ( "Unable to setup ISR\n");
	  return 1;
	}
	

	return 0;
}

int timer_init()
{
	int fd;
	void *st_base;
	
	// get access to system core memory
	if (-1 == (fd = open("/dev/mem", O_RDONLY))) {
		fprintf(stderr, "open() failed.\n");
		return 255;
	}

	// map a specific page into process's address space
	if (MAP_FAILED == (st_base = mmap(NULL, 4096,
				       	PROT_READ, MAP_SHARED, fd, ST_BASE))) {
		fprintf(stderr, "mmap() failed.\n");
		return 254;
	}
	
	timer = (long long int *)((char *)st_base + TIMER_OFFSET);
	prev_timer = *timer;
	
	return 0;
}

int main(void)
{

	int i = 0;

	if (gpio_init())
		return 1;

	if (timer_init())
		return 1;
	
	
    while(1) {
		delay(1000); // wait 1 second

		/*
		for (i = 0; i < 1000; i++)
			printf("%lld,",low_high_list[i]); 
		*/
	
		
		
		int byte_index = code_bit_index  / 8;

		int i = 0;
		for (i = 0; i < byte_index; i++)
			printf("0x%x,", code_byte[i]);
	
		printf("[%d]", code_bit_index);//48
	
		printf("\n");
	
	}

	return 0;
}
