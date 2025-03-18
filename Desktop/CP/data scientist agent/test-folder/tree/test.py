from tree_sitter import Language, Parser

# Build the JavaScript language
Language.build_library(
    'build/my-languages.so',
    [
        './tree-sitter-javascript'
    ]
)

# Load the JavaScript language
JS_LANGUAGE = Language('build/my-languages.so', 'javascript')

# Create a parser
parser = Parser()
parser.set_language(JS_LANGUAGE)

# Example JavaScript code
code = b"""
function hello() {
    console.log("Hello, world!");
}
"""

# Parse the code
tree = parser.parse(code)

# Function to print the syntax tree
def print_tree(node, indent=""):
    print(f"{indent}{node.type} ({node.start_byte}-{node.end_byte})")
    for child in node.children:
        print_tree(child, indent + "  ")

# Print the tree
print_tree(tree.root_node)