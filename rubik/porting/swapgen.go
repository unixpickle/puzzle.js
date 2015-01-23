package main

import (
  "fmt"
  "os"
)

func main() {
  if len(os.Args) != 6 {
    fmt.Println("Invalid arguments");
    return
  }
  fmt.Println("      var ref = " + os.Args[1] + "[" + os.Args[2] + "];")
  fmt.Println("      " + os.Args[1] + "[" + os.Args[2] + "] = " + os.Args[1] + "[" + os.Args[3] + "];")
  fmt.Println("      " + os.Args[1] + "[" + os.Args[3] + "] = ref;")
  fmt.Println("      ref = " + os.Args[1] + "[" + os.Args[4] + "];")
  fmt.Println("      " + os.Args[1] + "[" + os.Args[4] + "] = " + os.Args[1] + "[" + os.Args[5] + "];")
  fmt.Println("      " + os.Args[1] + "[" + os.Args[5] + "] = ref;")
}
