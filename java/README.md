# Caesar Cipher Implementation in Java

A simple and efficient Caesar cipher implementation that can encrypt, decrypt, and brute-force crack Caesar cipher messages.

## Features

- **Encrypt messages** with any shift value
- **Decrypt messages** when you know the shift value
- **Brute force attack** to crack encrypted messages by trying all possible shifts (0-25)
- **Case preservation** - uppercase and lowercase letters are maintained
- **Non-alphabetic character preservation** - numbers, punctuation, and spaces remain unchanged
- **Handles negative shifts** - automatically normalizes shift values

## Usage

### Compile and Run

```bash
# Navigate to the source directory
cd java/src/main/java

# Compile the Java file
javac com/rolecolorai/cipher/CaesarCipher.java

# Run the program
java com.rolecolorai.cipher.CaesarCipher
```

### Using the Methods

```java
// Encrypt a message
String encrypted = CaesarCipher.encrypt("Hello World!", 3);
// Result: "Khoor Zruog!"

// Decrypt a message
String decrypted = CaesarCipher.decrypt("Khoor Zruog!", 3);
// Result: "Hello World!"

// Brute force attack (try all possible shifts)
String[] allPossibilities = CaesarCipher.bruteForceDecrypt("Khoor Zruog!");
// Returns array with all 26 possible decryptions
```

## How It Works

The Caesar cipher shifts each letter in the alphabet by a fixed number of positions. For example, with a shift of 3:
- A → D
- B → E  
- C → F
- ...
- X → A (wraps around)
- Y → B
- Z → C

## Example Output

```
=== Caesar Cipher Demo ===
Original message: Hello, World! This is a Caesar cipher test.
Shift value: 3
Encrypted message: Khoor, Zruog! Wklv lv d Fdhvdu flskhu whvw.
Decrypted message: Hello, World! This is a Caesar cipher test.

=== Brute Force Attack Demo ===
Encrypted message to break: Wklv lv d vhfuhw phvvdjh!
Trying all possible shifts:
Shift 0: Wklv lv d vhfuhw phvvdjh!
Shift 1: Vjku ku c ugetgv oguucig!
Shift 2: Uijt jt b tfdsfu nfttbhf!
Shift 3: This is a secret message!  ← Correct decryption!
...
```

## Security Note

The Caesar cipher is a very simple substitution cipher and is **not secure** for real-world use. It can be easily broken by:
1. Brute force (trying all 25 possible shifts)
2. Frequency analysis
3. Pattern recognition

This implementation is for educational purposes and demonstrates basic cryptographic concepts.
