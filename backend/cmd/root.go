package cmd

import (
	"github.com/spf13/cobra"
	"os"

	"github.com/spf13/viper"
)

func RootCmd() *cobra.Command {
	var cmd = &cobra.Command{
		Use: "medieval-dynasty-app",
	}

	cmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")

	cmd.AddCommand(startCmd())
	return cmd
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	cobra.OnInitialize(func() {
		viper.AutomaticEnv() // read in environment variables that match

		viper.AddConfigPath(".")
		viper.SetConfigFile(".env")

		_ = viper.ReadInConfig()
	})

	cmd := RootCmd()

	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
