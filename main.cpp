#include <iostream>

void find_Max_and_Min(int * array, const int & size);

int main(){
    int array[10];

    for(int i = 0; i < 10; ++i){
        std::cout << "Please enter an integer: ";
        std::cin >> array[i];
        find_Max_and_Min(array, i + 1);
    }
    return 0;
}

void find_Max_and_Min(int * array, const int & size){
    int max, min = 0;

    for(int i = 0; i < size; ++i){
        /*First element is assigned to min and max */
        if(i == 0){
            max = array[i];
            min = array[i];
        }
        else if(array[i] > max){
            max = array[i];
        }
        else if(array[i] < min){
            min = array[i];
        }
    }
    std::cout << "Max: " << max << "\nMin: " << min << std::endl;
    return;
}
