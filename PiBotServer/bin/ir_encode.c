#include <wiringPi.h>
#include <stdio.h> 
#include <wiringPi.h>
#include <sys/time.h>
#include <sys/mman.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include "stdlib.h"
#include <stdint.h>


#define PWM_PIN 18
#define TIMER_OFFSET (4)
#define ST_BASE (0x3F003000)

#define NEC_HDR_MARK    4500
#define NEC_HDR_SPACE   4500
#define NEC_BIT_MARK     560
#define NEC_ONE_SPACE   1690
#define NEC_ZERO_SPACE   560
#define PWM_DELAY 200*2


#define BIT(x) (1<<x)
static long long int   *timer; // 64 bit timer

void delay_us(int us)
{
	long long int prev_timer;
	prev_timer = *timer;
	while (*timer - prev_timer < us)
		;
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
	
	return 0;
}


void output_init()
{
	pinMode(PWM_PIN,PWM_OUTPUT);
	/* 500/1000 = 0.5 duty cycle */
	
#if 1
	pwmSetRange(1000) ;
	pwmWrite(PWM_PIN, 500);
#else
	pwmSetRange(2600) ;
	pwmWrite(PWM_PIN, 800);
#endif
	
	pwmSetClock(252);
	
}

//it is slow begin
void output_38k()
{
	pwmSetClock(252);
}
//it is fast off
void output_38k_off()
{
	pwmSetClock(0);
}



void send_bit(int bit)
{
	//printf("send %d\n", bit);
	if (bit == 1) {
		output_38k();
		delay_us(NEC_BIT_MARK);
		output_38k_off();
		delay_us(NEC_ONE_SPACE - PWM_DELAY);
	} else if (bit == 0) {
		output_38k();
		delay_us(NEC_BIT_MARK);
		output_38k_off();
		delay_us(NEC_ZERO_SPACE - PWM_DELAY);
	} else
		printf("critical error!\n");

}

void send_byte(unsigned char byte)
{
	int  i = 0;

	for (i = 7; i >= 0; i--)
		send_bit(((byte & BIT(i)) >> i));
		
}

void send_data(unsigned char* data, int len)
{
	int i  = 0;
	
	output_38k();
	delay_us(NEC_HDR_MARK);
	output_38k_off();
	delay_us(NEC_HDR_MARK - PWM_DELAY);

	for (i = 0; i < len; i++)
		send_byte(data[i]);

	send_bit(1);
	delay_us(NEC_HDR_MARK- PWM_DELAY);

}

/* 0xb2,0x4d,0x9f,0xe0,0xd8,0xaf */
unsigned int rawCodes_ac_open[] = {4397,4368,561,1578,560,537,557,1581,584,1582,584,486,558,537,584,1554,560,538,558,510,558,1607,557,513,585,511,556,1585,581,1583,583,486,557,1609,556,513,558,538,557,512,558,1607,558,1583,557,1608,558,1608,557,1580,559,1606,559,1581,556,1609,557,512,559,537,558,512,557,539,557,512,558,1607,558,1582,558,537,584,1555,558,1607,556,514,559,537,556,513,558,537,556,514,558,1606,559,511,583,513,558,1582,557,1608,558,1580,585,5154,4419,4347,584,1555,558,539,557,1581,584,1581,571,501,577,516,571,1568,557,541,581,487,557,1608,557,513,558,538,557,1582,583,1582,584,487,557,1608,557,511,611,486,558,510,558,1607,557,1609,556,1583,583,1582,583,1555,558,1607,558,1607,559,1582,557,537,585,486,558,510,558,540,558,509,557,1608,558,1608,557,512,559,1606,559,1581,558,537,581,490,558,510,587,511,557,511,559,1606,559,510,569,527,558,1582,560,1604,561,1605,561};




void send_raw(int *code, int size)
{

	int i = 0;


	for (i = 0; i < size; i++) {
		if (i%2 == 0) {
			output_38k();
			delay_us(code[i]);
		} else {
			output_38k_off();
			delay_us(code[i] - 200*2);
			
		}
	}
		

}


int main (void)
{
	/* temperature 26 ^C */
	char data[6] = {0xb2,0x4d,0x7b,0x84,0xe0,0x1f};
	
	
	if (wiringPiSetupGpio() == -1)
		return 1;

	if (timer_init())
		return 1;

	printf ("Raspberry Pi IR encode program....\n") ;

	pinMode (26, OUTPUT) ;

			output_init();
			

			#if 0 
			send_raw(rawCodes_ac_open, sizeof(rawCodes_ac_open)/sizeof(int));
			#else
			send_data(data, 6);
			send_data(data, 6);
			#endif

			
			pinMode(PWM_PIN,OUTPUT);


	printf("end of program \n");
	output_38k_off();
	//pinMode(PWM_PIN,OUTPUT);
}
