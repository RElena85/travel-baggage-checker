package main

import (
	"fmt"
	"os"
)

func main() {
	dirs := []string{
		"C:\\Users\\rafae\\Documents\\Respositories\\travel-baggage-checker\\trip-manager-app\\src",
		"C:\\Users\\rafae\\Documents\\Respositories\\travel-baggage-checker\\trip-manager-app\\public",
	}

	for _, dir := range dirs {
		err := os.MkdirAll(dir, 0755)
		if err != nil {
			fmt.Printf("Error creating %s: %v\n", dir, err)
		} else {
			fmt.Printf("Created: %s\n", dir)
		}
	}
}
