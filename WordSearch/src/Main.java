public class Main {
    public static void main(String[] args) throws Exception {

        String filePath = "Demo.txt";
        String word = "Files";

        long start1 = System.currentTimeMillis();
        int singleCount = SingleThreadSearch.search(filePath, word);
        long end1 = System.currentTimeMillis();
        System.out.println("Single Thread Count: " + singleCount);
        System.out.println("Time Taken (Single): " + (end1 - start1) + " ms\n");

        long start2 = System.currentTimeMillis();
        int multiCount = MultiThreadSearch.search(filePath, word);
        long end2 = System.currentTimeMillis();
        System.out.println("Multi Thread Count: " + multiCount);
        System.out.println("Time Taken (Multi): " + (end2 - start2) + " ms");

        System.out.println("\nCPU Threads Used: " + Runtime.getRuntime().availableProcessors());
    }
}
