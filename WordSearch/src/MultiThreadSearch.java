import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

public class MultiThreadSearch {

    private static class SearchTask implements Callable<Integer> {
        private final List<String> lines;
        private final String word;

        public SearchTask(List<String> lines, String word) {
            this.lines = lines;
            this.word = word;
        }

        @Override
        public Integer call() {
            int count = 0;
            for (String line : lines) {
                if (line.contains(word)) {
                    count++;
                }
            }
            return count;
        }
    }

    public static int search(String filePath, String word) throws Exception {
        int cores = Runtime.getRuntime().availableProcessors();
        ExecutorService executor = Executors.newFixedThreadPool(cores);
        List<Future<Integer>> results = new ArrayList<>();

        BufferedReader reader = new BufferedReader(new FileReader(filePath));
        List<String> linesBatch = new ArrayList<>();
        int batchSize = 1000; // adjustable batch (per thread)

        String line;
        while ((line = reader.readLine()) != null) {
            linesBatch.add(line);

            if (linesBatch.size() == batchSize) {
                results.add(executor.submit(new SearchTask(new ArrayList<>(linesBatch), word)));
                linesBatch.clear();
            }
        }

        if (!linesBatch.isEmpty()) {
            results.add(executor.submit(new SearchTask(linesBatch, word)));
        }

        reader.close();
        executor.shutdown();

        int total = 0;
        for (Future<Integer> result : results) {
            total += result.get();
        }

        return total;
    }
}
