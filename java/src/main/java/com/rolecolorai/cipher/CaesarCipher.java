package com.rolecolorai.cipher;

/**
 * A simple Caesar cipher implementation that shifts letters by a specified amount.
 * The cipher preserves case and leaves non-alphabetic characters unchanged.
 */
public class CaesarCipher {
    
    /**
     * Encrypts a message using Caesar cipher with the given shift value.
     * 
     * @param message The message to encrypt
     * @param shift The number of positions to shift each letter (positive for right shift)
     * @return The encrypted message
     */
    public static String encrypt(String message, int shift) {
        if (message == null) {
            return null;
        }
        
        StringBuilder result = new StringBuilder();
        
        // Normalize shift to be within 0-25 range
        shift = ((shift % 26) + 26) % 26;
        
        for (char character : message.toCharArray()) {
            if (Character.isLetter(character)) {
                char base = Character.isUpperCase(character) ? 'A' : 'a';
                char shiftedChar = (char) ((character - base + shift) % 26 + base);
                result.append(shiftedChar);
            } else {
                // Keep non-alphabetic characters unchanged
                result.append(character);
            }
        }
        
        return result.toString();
    }
    
    /**
     * Decrypts a message using Caesar cipher with the given shift value.
     * 
     * @param encryptedMessage The message to decrypt
     * @param shift The number of positions that were used to shift each letter during encryption
     * @return The decrypted message
     */
    public static String decrypt(String encryptedMessage, int shift) {
        // To decrypt, we shift in the opposite direction
        return encrypt(encryptedMessage, -shift);
    }
    
    /**
     * Attempts to break a Caesar cipher by trying all possible shifts (0-25)
     * and returning all possible decryptions.
     * 
     * @param encryptedMessage The encrypted message to break
     * @return An array of all possible decryptions
     */
    public static String[] bruteForceDecrypt(String encryptedMessage) {
        String[] results = new String[26];
        
        for (int shift = 0; shift < 26; shift++) {
            results[shift] = "Shift " + shift + ": " + decrypt(encryptedMessage, shift);
        }
        
        return results;
    }
    
    /**
     * Main method for testing the Caesar cipher implementation.
     */
    public static void main(String[] args) {
        // Example usage
        String originalMessage = "Hello, World! This is a Caesar cipher test.";
        int shift = 3;
        
        System.out.println("=== Caesar Cipher Demo ===");
        System.out.println("Original message: " + originalMessage);
        System.out.println("Shift value: " + shift);
        
        // Encrypt the message
        String encrypted = encrypt(originalMessage, shift);
        System.out.println("Encrypted message: " + encrypted);
        
        // Decrypt the message
        String decrypted = decrypt(encrypted, shift);
        System.out.println("Decrypted message: " + decrypted);
        
        System.out.println("\n=== Brute Force Attack Demo ===");
        String secretMessage = "Wklv lv d vhfuhw phvvdjh!";
        System.out.println("Encrypted message to break: " + secretMessage);
        System.out.println("Trying all possible shifts:");
        
        String[] bruteForceResults = bruteForceDecrypt(secretMessage);
        for (String result : bruteForceResults) {
            System.out.println(result);
        }
    }
}
