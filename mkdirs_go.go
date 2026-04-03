package main

import (
	"fmt"
	"os"
)

func main() {
	base := `C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app`
	dirs := []string{
		base + `\public`,
		base + `\src\types`,
		base + `\src\context`,
		base + `\src\hooks`,
		base + `\src\utils`,
		base + `\src\components`,
		base + `\src\pages`,
		base + `\src\styles`,
	}
	for _, d := range dirs {
		if err := os.MkdirAll(d, 0755); err != nil {
			fmt.Println("ERROR mkdir:", d, err)
			continue
		}
		fmt.Println("OK dir:", d)
		gk := d + `\.gitkeep`
		f, err := os.Create(gk)
		if err != nil {
			fmt.Println("ERROR gitkeep:", gk, err)
		} else {
			f.Close()
			fmt.Println("OK gitkeep:", gk)
		}
	}
	fmt.Println("Done.")
}
