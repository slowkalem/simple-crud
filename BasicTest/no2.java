package BasicTest;

import java.io.*;
import java.util.*;
import java.util.stream.*;

public class no2 {
    public static void main(String[] args) throws IOException {
        // Read input from console
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));

        // Read the size of the array (not used directly in the code)
        int n = Integer.parseInt(bufferedReader.readLine().trim());

        // Parse the input array
        List<Integer> arr = Arrays.stream(bufferedReader.readLine().trim().split(" "))
                .map(Integer::parseInt)
                .collect(Collectors.toList());

        // Call the plusMinus function
        Result.plusMinus(arr);

        // Close the reader
        bufferedReader.close();
    }

    class Result {

        /*
         * Complete the 'plusMinus' function below.
         *
         * The function accepts List<Integer> arr as parameter.
         */
        public static void plusMinus(List<Integer> arr) {
            double counterPlus = 0;
            double counterNegative = 0;
            double counterZero = 0;

            // Loop through the array and count positives, negatives, and zeros
            for (int data : arr) {
                if (data < 0) {
                    counterNegative += 1;
                } else if (data > 0) {
                    counterPlus += 1;
                } else {
                    counterZero += 1;
                }
            }

            // Calculate proportions and format to 6 decimal places
            double pPlus = counterPlus / arr.size();
            double pNegative = counterNegative / arr.size();
            double pZero = counterZero / arr.size();

            // Print the results
            System.out.printf("%.6f%n", pPlus);
            System.out.printf("%.6f%n", pNegative);
            System.out.printf("%.6f%n", pZero);
        }
    }

}
