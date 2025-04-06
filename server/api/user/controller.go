package user

import (
	common "resulturan/live-chat-server/internal"

	"resulturan/live-chat-server/api/user/dto"
	"resulturan/live-chat-server/internal/network"

	"github.com/gin-gonic/gin"
)

type controller struct {
	network.BaseController
	common.ContextPayload
	service Service
}

func NewController(
	service Service,
) network.Controller {
	return &controller{
		BaseController: network.NewBaseController("/api/profile"),
		ContextPayload: common.NewContextPayload(),
		service:        service,
	}
}

func (c *controller) MountRoutes(group *gin.RouterGroup) {
	group.POST("", c.createUserHandler)
	group.GET("", c.getUserListHandler)
	group.POST("/get-or-create", c.getOrCreateUserHandler)
}

func (c *controller) createUserHandler(ctx *gin.Context) {
	body, err := network.ReqBody(ctx, dto.EmptyCreateUser())
	if err != nil {
		c.Send(ctx).BadRequestError(err.Error(), err)
		return
	}

	data, err := c.service.CreateUser(body)
	if err != nil {
		c.Send(ctx).MixedError(err)
		return
	}

	c.Send(ctx).SuccessDataResponse("success", data)
}

func (c *controller) getUserListHandler(ctx *gin.Context) {
	data, err := c.service.GetUserList()
	if err != nil {
		c.Send(ctx).MixedError(err)
		return
	}

	c.Send(ctx).SuccessDataResponse("success", data)
}

func (c *controller) getOrCreateUserHandler(ctx *gin.Context) {
	body, err := network.ReqBody(ctx, dto.EmptyCreateUser())
	if err != nil {
		c.Send(ctx).BadRequestError(err.Error(), err)
		return
	}


	data, err := c.service.GetOrCreateUser(body.Username)
	if err != nil {
		c.Send(ctx).MixedError(err)
		return
	}

	c.Send(ctx).SuccessDataResponse("success", data)
}
