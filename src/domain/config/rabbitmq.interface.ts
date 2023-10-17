export interface RabbitMQConfig {
  getRabbitMQHost(): string;
  getRabbitMQUser(): string;
  getRabbitMQPassword(): string;
  getRabbitMQQueueService(): string;
}
