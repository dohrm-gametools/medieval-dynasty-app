package cmd

import (
	"github.com/dohrm-gametools/medieval-dynasty-app/pkg"
	"github.com/spf13/cobra"
)

func startCmd() *cobra.Command {

	// startCmd represents the start command
	var cmd = &cobra.Command{
		Use:   "start",
		Short: "Start",
		RunE:  func(cmd *cobra.Command, args []string) error { return pkg.Start() },
	}
	return cmd
}
