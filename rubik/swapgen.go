package main

import (
  "fmt"
  "os"
)

func main() {
  if len(os.Args) != 4 {
    fmt.Println("Invalid arguments");
    return
  }
  fmt.Println("      var ref = " + os.Args[1] + "[" + os.Args[2] + "];")
  fmt.Println("      " + os.Args[1] + "[" + os.Args[2] + "] = " + os.Args[1] + "[" + os.Args[3] + "];")
  fmt.Println("      " + os.Args[1] + "[" + os.Args[3] + "] = ref;")
}
