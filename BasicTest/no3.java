package BasicTest;

import java.io.*;
import java.text.*;
import java.util.*;

public class no3 {
    public static void main(String[] args) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));

        // Read the input time string
        String s = bufferedReader.readLine();

        // Call the timeConversion method
        String result = Result.timeConversion(s);

        // Display the result to the console
        System.out.println(result);

        // Close resources
        bufferedReader.close();
    }

    class Result {

        /*
         * Complete the 'timeConversion' function below.
         *
         * The function is expected to return a STRING.
         * The function accepts STRING s as parameter.
         */
        public static String timeConversion(String s) {
            try {
                // Parse the input time string using 12-hour format
                SimpleDateFormat inputFormat = new SimpleDateFormat("hh:mm:ssa");

                // Convert to 24-hour format
                SimpleDateFormat outputFormat = new SimpleDateFormat("HH:mm:ss");

                // Parse and format the time
                Date date = inputFormat.parse(s);
                return outputFormat.format(date);
            } catch (ParseException e) {
                // Handle parsing error
                e.printStackTrace();
                return null;
            }
        }
    }
}