package items

import (
	"github.com/dohrm-gametools/medieval-dynasty-app/tools"
	"github.com/gin-gonic/gin"
)

func Routes(services Services, router *gin.RouterGroup, parseErrors func(err error, ctx *gin.Context), authMiddleware gin.HandlerFunc) {
	tools.GinCrudApi(
		services,
		router,
		parseErrors,
		authMiddleware,
	)
}
