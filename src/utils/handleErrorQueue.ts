import { Channel } from 'amqp-connection-manager';
import { ConsumeMessage } from 'amqplib';
import { isJSON } from 'class-validator';

export const handleError = async (
  channel: Channel,
  amqpMsg: ConsumeMessage,
  error: any,
) => {
  const now = Date.now();

  const { properties } = amqpMsg;

  const { replyTo, correlationId } = properties;

  const { Header } = JSON.parse(amqpMsg.content.toString());

  await channel.sendToQueue(
    replyTo,
    Buffer.from(
      JSON.stringify({
        Header,
        data: null,
        respCode: 'ERROR',
        error: error.response,
        errorDetail: '',
      }),
    ),
    {
      correlationId,
    },
  );

  channel.ack(amqpMsg);

  const errorMessage = error?.response?.message || '';

  let jsonError: string[] = [];

  if (Array.isArray(errorMessage)) {
    jsonError = errorMessage.map(function (ele) {
      return isJSON(ele) ? JSON.parse(ele) : { message: ele };
    });
  } else {
    jsonError = [
      isJSON(errorMessage) ? JSON.parse(errorMessage) : { error: errorMessage },
    ];
  }

  const devErrorResponse: any = {
    Header,
    duration: `${Date.now() - now}ms`,
    errors: jsonError,
  };

  console.log('[MESSAGE-ERROR]', JSON.stringify(devErrorResponse));
};
