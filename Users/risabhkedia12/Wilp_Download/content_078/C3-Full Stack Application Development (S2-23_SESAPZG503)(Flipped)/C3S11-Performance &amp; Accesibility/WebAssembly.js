
Step-1
=======
First, let's create a simple C program (add.c) that adds two numbers:

// add.c
int add(int a, int b) {
    return a + b;
}

Step-2
=======
Now, let's compile this C program into WebAssembly using emcc (the Emscripten compiler):

emcc add.c -o add.wasm -s EXPORTED_FUNCTIONS="['_add']"

This command will generate a WebAssembly file called add.wasm that exports the add function.


Step-3
=======

// index.html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebAssembly Example</title>
</head>
<body>
    <h1>WebAssembly Example</h1>
    <p>Result: <span id="result"></span></p>

    <script>
        fetch('add.wasm')
            .then(response => response.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, {}))
            .then(obj => {
                const add = obj.instance.exports._add; // Accessing the exported add function
                const result = add(5, 3); // Calling the add function with two numbers
                document.getElementById('result').textContent = result; // Displaying the result
            })
            .catch(console.error);
    </script>
</body>
</html>

----
1) load the add.wasm file using the Fetch API.
2) instantiate the WebAssembly module using WebAssembly.instantiate.
3) access the exported add function from the WebAssembly instance.
4) call the add function with two numbers (5 and 3 in this case).
5) display the result on the web page.


When you open index.html in a web browser, you should see "Result: 8" displayed on the page, indicating that the WebAssembly module successfully added the two numbers.