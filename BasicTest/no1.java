package BasicTest;

import java.io.*;
import java.util.*;
import java.util.stream.*;

public class no1 {
    public static void main(String[] args) throws IOException {
        // Read input from console
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));

        // Parse input into a list of integers
        List<Integer> arr = Arrays.stream(bufferedReader.readLine().trim().split(" "))
                .map(Integer::parseInt)
                .collect(Collectors.toList());

        // Call the miniMaxSum function
        Result.miniMaxSum(arr);

        // Close the reader
        bufferedReader.close();
    }

    class Result {

        /*
         * Complete the 'miniMaxSum' function below.
         *
         * The function accepts List<Integer> arr as parameter.
         */

        public static void miniMaxSum(List<Integer> arr) {
            // Sort the array
            Collections.sort(arr);

            long min = 0, max = 0;
            int n = arr.size();

            // Calculate the minimum sum (first 4 elements)
            for (int i = 0; i < 4; i++) {
                min += arr.get(i);
            }

            // Calculate the maximum sum (last 4 elements)
            for (int i = n - 1; i > n - 5; i--) {
                max += arr.get(i);
            }

            // Print the results
            System.out.printf("%d %d%n", min, max);
        }
    }

}