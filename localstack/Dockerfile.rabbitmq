FROM rabbitmq:3.13-management
ENV DELAY_PLUGIN_NAME rabbitmq_delayed_message_exchange
ENV DELAY_PLUGIN_VERSION 3.13.0
ENV DELAY_PLUGIN_BINARY ${DELAY_PLUGIN_NAME}-${DELAY_PLUGIN_VERSION}.ez
ENV DELAY_PLUGIN_REGISTRY https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download
ENV DELAY_PLUGIN_LOCATION ${RABBITMQ_HOME}/plugins/${DELAY_PLUGIN_BINARY}
RUN apt update \
  && apt install -y curl \
  && apt clean
RUN curl -L ${DELAY_PLUGIN_REGISTRY}/v${DELAY_PLUGIN_VERSION}/${DELAY_PLUGIN_BINARY} > ${DELAY_PLUGIN_LOCATION}
RUN chown rabbitmq:rabbitmq ${DELAY_PLUGIN_LOCATION}
RUN rabbitmq-plugins enable rabbitmq_delayed_message_exchange rabbitmq_shovel rabbitmq_shovel_management
