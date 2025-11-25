import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

public class MultiThreadSearch {

    public static int search(String filePath, String word, int numThreads) throws Exception {
        File file = new File(filePath);
        long chunkSize = file.length() / numThreads;

        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        List<Future<Integer>> futures = new ArrayList<>();

        for (int i = 0; i < numThreads; i++) {
            long start = i * chunkSize;
            long end = (i == numThreads - 1) ? file.length() : (i + 1) * chunkSize;

            futures.add(executor.submit(() -> countWord(filePath, word, start, end)));
        }

        int total = 0;
        for (Future<Integer> future : futures) {
            total += future.get();
        }

        executor.shutdown();
        return total;
    }

    private static int countWord(String filePath, String word, long start, long end) throws IOException {
        RandomAccessFile raf = new RandomAccessFile(filePath, "r");
        raf.seek(start);

        int count = 0;
        String line;
        while (raf.getFilePointer() <= end &&
                (line = raf.readLine()) != null) {
            if (line.contains(word)) {
                count++;
            }
        }
        raf.close();
        return count;
    }
}
