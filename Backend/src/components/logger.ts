import pino from "pino";

const fileTransportForFile = pino.transport({
  target: 'pino/file',
 
});

const transport = pino.transport({
    targets: [
      {
        target: 'pino/file',
        options: { destination: `../app.log` },
      },
      {
        target: 'pino-pretty', // по-умолчанию логирует в стандартный вывод
      },
    ],
  });

const fileTransportForConsole = pino.transport({
    target: 'pino/file',
  });

export default pino(
    {
        level: "debug",
        timestamp: pino.stdTimeFunctions.isoTime,
      }, 
      // transport
  
);