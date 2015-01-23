// This utility is helping me port Go to JavaScript
package main

import (
  "fmt"
  "os"
)

func main() {
  if len(os.Args) != 10 {
    fmt.Println("need 9 arguments.");
    return
  }
  sets := os.Args[2:6]
  gets := os.Args[6:10]
  if sets[0] == gets[1] && sets[1] == gets[2] && sets[2] == gets[3] && sets[3] == gets[0] {
    permuteBackwards(os.Args[1], sets)
  } else if sets[1] == gets[0] && sets[2] == gets[1] && sets[3] == gets[2] && sets[0] == gets[3] {
    permuteForwards(os.Args[1], sets)
  } else {
    fmt.Println("// Invalid permutation")
  }
}

func permuteForwards(listName string, args []string) {
  fmt.Println("        var ref = " + listName + "[" + args[0] + "];")
  fmt.Println("        " + listName + "[" + args[0] + "] = " + listName + "[" + args[1] + "];")
  fmt.Println("        " + listName + "[" + args[1] + "] = " + listName + "[" + args[2] + "];")
  fmt.Println("        " + listName + "[" + args[2] + "] = " + listName + "[" + args[3] + "];")
  fmt.Println("        " + listName + "[" + args[3] + "] = ref;")
}

func permuteBackwards(listName string, args []string) {
  fmt.Println("        var ref = " + listName + "[" + args[3] + "];")
  fmt.Println("        " + listName + "[" + args[3] + "] = " + listName + "[" + args[2] + "];")
  fmt.Println("        " + listName + "[" + args[2] + "] = " + listName + "[" + args[1] + "];")
  fmt.Println("        " + listName + "[" + args[1] + "] = " + listName + "[" + args[0] + "];")
  fmt.Println("        " + listName + "[" + args[0] + "] = ref;")
}

