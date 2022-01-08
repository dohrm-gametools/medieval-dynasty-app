package productions

import (
	"context"
	"github.com/dohrm-gametools/medieval-dynasty-app/tools"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func Routes(services Services, router *gin.RouterGroup, parseErrors func(err error, ctx *gin.Context), authMiddleware gin.HandlerFunc) {
	timeout := 5 * time.Second
	tools.GinCrudApi(
		services,
		router,
		parseErrors,
		authMiddleware,
	)
	router.POST("/bulk-from-excel", func(c *gin.Context) {
		// TODO Add Validation
		payload := FromExcelProductionList{}
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		res, err := services.CreateBulkFromExcel(payload, ctx)
		if err != nil {
			parseErrors(err, c)
			return
		}
		c.JSON(201, gin.H{"created": res})
	})
}
