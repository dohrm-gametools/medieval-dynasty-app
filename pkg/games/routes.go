package games

import (
	"context"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func Routes(services Services, router *gin.RouterGroup, parseErrors func(err error, ctx *gin.Context), authMiddleware gin.HandlerFunc) {
	timeout := 5 * time.Second

	router.POST("/", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		data, err := services.Create(ctx)
		if err != nil {
			parseErrors(err, c)
			return
		}
		c.JSON(200, data)
	})
	router.GET("/:id", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		id := c.Param("id")

		data, err := services.FindOne(id, ctx)
		if err != nil {
			parseErrors(err, c)
			return
		}
		c.JSON(200, data)
	})
	router.PUT("/:id/workers", func(c *gin.Context) {
		// TODO Validation
		worker := Worker{}
		if err := c.ShouldBindJSON(&worker); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		id := c.Param("id")
		data, err := services.CreateOrUpdateWorker(id, worker, ctx)
		if err != nil {
			parseErrors(err, c)
			return
		}
		c.JSON(200, data)
	})
	router.DELETE("/:id/workers/:workerId", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		id := c.Param("id")
		workerId := c.Param("workerId")
		data, err := services.DeleteWorker(id, workerId, ctx)
		if err != nil {
			parseErrors(err, c)
			return
		}
		c.JSON(200, data)
	})
	router.PUT("/:id/buildings", func(c *gin.Context) {
		// TODO Validation
		building := TownBuilding{}
		if err := c.ShouldBindJSON(&building); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		id := c.Param("id")
		data, err := services.CreateOrUpdateBuilding(id, building, ctx)
		if err != nil {
			parseErrors(err, c)
			return
		}
		c.JSON(200, data)
	})
	router.DELETE("/:id/buildings/:buildingId", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		id := c.Param("id")
		buildingId := c.Param("buildingId")
		data, err := services.DeleteBuilding(id, buildingId, ctx)
		if err != nil {
			parseErrors(err, c)
			return
		}
		c.JSON(200, data)
	})
}
