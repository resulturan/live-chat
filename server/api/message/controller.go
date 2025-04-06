package message

import (
	"resulturan/live-chat-server/api/message/dto"
	"resulturan/live-chat-server/internal"
	"resulturan/live-chat-server/internal/network"

	"github.com/gin-gonic/gin"
)

type controller struct {
	network.BaseController
	internal.ContextPayload
	service Service
}

func NewController(
	service Service,
) network.Controller {
	return &controller{
		BaseController: network.NewBaseController("/api/message"),
		ContextPayload: internal.NewContextPayload(),
		service:        service,
	}
}

func (c *controller) MountRoutes(group *gin.RouterGroup) {
	group.POST("", c.createMessageHandler)
	group.GET("", c.getMessageListHandler)
}

func (c *controller) createMessageHandler(ctx *gin.Context) {
	body, err := network.ReqBody(ctx, dto.EmptyCreateMessage())
	if err != nil {
		c.Send(ctx).BadRequestError(err.Error(), err)
		return
	}

	data, err := c.service.CreateMessage(body)
	if err != nil {
		c.Send(ctx).MixedError(err)
		return
	}

	c.Send(ctx).SuccessDataResponse("success", data)
}

func (c *controller) getMessageListHandler(ctx *gin.Context) {
	data, err := c.service.GetMessageList()
	if err != nil {
		c.Send(ctx).MixedError(err)
		return
	}

	c.Send(ctx).SuccessDataResponse("success", data)
}
