---
title: A Quick C Refresher
date: "2020-09-20T18:45:03.284Z"
description: "For people like me who haven't really looked at it in years"
tags: ["c", "programming"]
---

Back when I went to undergrad, the standard for learning programming at the time was to learn it
in C and C++.  I had to take other electives to cover scripting languages, and I didn't even touch
Java until after I entered the workforce.  Aside from a brief stint of working with embedded systems
and reverse engineering in grad school, I really haven't actually used C all that much since I
graudated so long ago.  However, recently, I've been playing around with development on the WonderWitch
for the WonderSwan, as documented in prior blogs, and it's caused me to have to blow the dust off
my knowledge of C.  So I figured, for my own benefit, it'd be a good idea to give myself a crash
course refresher on it.  That means I'm not going to explain basic concepts - this is going to be
pure syntax, and it's not gonna be exhaustive.

##Data Types

| Type | Size (bytes) |
|------|--------------|
| char | 1 |
| int | 4 |
| float | 4 | 
| double | 8 |
| long int | 8 |
| short int | 2 |

More data types are on [Wikipedia](https://en.wikipedia.org/wiki/C_data_types)

##Main Function

```c
#include <stdio.h>

void main() {

    printf("Hello, world!");

    return;
}
```

##Using printf

```c
int printf(const char *format, ...);
```

Format specifier:

```
%[flags][width][.precision][length]specifier
```

| Type | Format |
|------|--------|
| character | %c |
| integer | %d |
| float | %f |
| string | %s |

More on printf formats [here](https://www.tutorialspoint.com/c_standard_library/c_function_printf.htm)

##Operators

| Operator | Definition |
|----------|------------|
|  ==      | Equals     |
| >        | Greater than |
| >=       | Greater than or equal to |
| <        | Less than |
| <=       | Less than or equal to |
| !=       | Not equal |
| &&       | AND (Logical) |
| \|\|       | OR (Logical) |
| !        | NOT |
| & | AND (Bitwise) |
| \| | OR (Bitwise) |
| << | Left shift |
| >> | Right shift |

##Flow Control

###if

```c
if(condition) {
   ...
}
else if( condition ) {
   ...
}
else {
   ...
}
```

###while

```c
while( condition ) {
   ...
}
```

###do while

```c
do {
    ...
} while( condition )
```

###for

```c
for( initializer ; condition ; increment) {
    ...
}
```

###switch

```c
switch(expression) {
    case value:
        ...
        break;
    default:
        ...
}
```

##Functions

```c
returnType name(...values) {
    ...
}
```

##Arrays

```c
type name[size] = {...values};

int test[10] = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

int test[2][5] = {{1, 2, 3, 4, 5}, {6, 7, 8, 9, 10}};
```

##Strings

```c
char test[5] = "hello";
```

Strings must be null terminated (\\0).

###strcpy

```c
char *strcpy(char *dest, char *src);
```

This function is potentially dangerous as it can result in a buffer overrun.

###strncpy

```c
char *strncpy(char *dest, char *source, size_t);
```

This function is potentially dangerous as it doesn't guarantee a null terminated string.

###strlen

```c
size_t strlen(char *src);
```

###strcat

```c
char *strcat(char *dest, char *src);
```

###strncat

```c
char *strncat(char *dest, char *src, size_t size);
```

###strcmp

```c
int *strcmp(char *stringOne, char *stringTwo);
```

More string functions can be found [here](https://www.tutorialspoint.com/c_standard_library/string_h.htm)

##Structures

```c
struct someName {
    type variableName;
    ...
}

...

struct someName myName;
myName.variableName;
```

##Preprocessor directives

```c
#define PI 3.14
#define DOUBLEPI (PI * 2)
#define MULTIPI(x) (PI * X)
```

##Pointers

```c
int *myPointer;
int myValue = 10;

myPointer = &myValue;

// *myPointer = 10
*myPointer += 10;

// myValue = 20
```