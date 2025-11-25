import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class SingleThreadSearch {

    public static int search(String filePath, String word) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(filePath));
        String line;
        int count = 0;

        while ((line = reader.readLine()) != null) {
            if (line.contains(word)) {
                count++;
            }
        }
        reader.close();
        return count;
    }
}
