package tools

import (
	"context"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func GinCrudApi(
	service Crud,
	router *gin.RouterGroup,
	parseErrors func(err error, ctx *gin.Context),
	authMiddleware gin.HandlerFunc,
) {
	timeout := 5 * time.Second

	router.OPTIONS("/", func(c *gin.Context) {
		c.JSON(200, gin.H{})
	})
	router.OPTIONS("/bulk", func(c *gin.Context) {
		c.JSON(200, gin.H{})
	})
	router.OPTIONS("/:id", func(c *gin.Context) {
		c.JSON(200, gin.H{})
	})

	router.GET("/", func(ctx *gin.Context) {
		c, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		res, err := service.FindAll(c)
		if err != nil {
			parseErrors(err, ctx)
			return
		}
		ctx.JSON(200, gin.H{"data": res})
	})

	router.GET("/:id", func(ctx *gin.Context) {
		c, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		id := ctx.Param("id")
		res, err := service.FindById(id, c)
		if err != nil {
			parseErrors(err, ctx)
			return
		}
		ctx.JSON(200, res)
	})
	router.POST("/", authMiddleware, func(ctx *gin.Context) {
		// TODO Add validation
		payload := service.OneSupplier()
		if err := ctx.ShouldBindJSON(payload); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		res, err := service.CreateOne(payload, c)
		if err != nil {
			parseErrors(err, ctx)
			return
		}
		ctx.JSON(201, res)
	})
	router.POST("/bulk", authMiddleware, func(ctx *gin.Context) {
		// TODO Add validation
		payload := service.ListSupplier()
		if err := ctx.ShouldBindJSON(&payload); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		res, err := service.CreateBulk(payload, c)
		if err != nil {
			parseErrors(err, ctx)
			return
		}
		ctx.JSON(201, gin.H{"created": res})
	})
	router.PUT("/:id", authMiddleware, func(ctx *gin.Context) {
		// TODO Add validation
		payload := service.OneSupplier()
		if err := ctx.ShouldBindJSON(payload); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		id := ctx.Param("id")
		res, err := service.Update(id, payload, c)
		if err != nil {
			parseErrors(err, ctx)
			return
		}
		ctx.JSON(200, res)
	})
	router.DELETE("/:id", authMiddleware, func(ctx *gin.Context) {
		c, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		id := ctx.Param("id")
		err := service.Delete(id, c)
		if err != nil {
			parseErrors(err, ctx)
			return
		}
	})
}
