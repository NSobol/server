const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();

class Ticket {
    constructor(id, name, status, created) {
        this.id = id, // идентификатор (уникальный в пределах системы)
        this.name = name, // краткое описание
        this.status = status, // boolean - сделано или нет
        this.created = created // дата создания (timestamp)
    }
}

class TicketFull {
    constructor(id, name, description, status, created) {
        this.id = id, // идентификатор (уникальный в пределах системы)
        this.name = name, // краткое описание
        this.description = description, // полное описание
        this.status = status, // boolean - сделано или нет
        this.created = created // дата создания (timestamp)
    }
}


//CORS
app.use(async (ctx, next) => {
    const origin = ctx.request.get('Origin');
    if (!origin) {
        return await next();
    }
    const headers = {
        'Access-Control-Allow-Origin': '*',
    };
    if (ctx.request.method !== 'OPTIONS') {
        ctx.response.set({
            ...headers
        });
        try {
            return await next();
        } catch (e) {
            e.headers = {
                ...e.headers,
                ...headers
            };
            throw e;
        }
	}
	
    if (ctx.request.get('Access-Control-Request-Method')) {
        ctx.response.set({
            ...headers,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
        });
        if (ctx.request.get('Access-Control-Request-Headers')) {
            ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
        }
        ctx.response.status = 204; // No content
    }
});

app.use(koaBody({
 text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}))

function tickets() { //отбор заявок
  const arr = [];
  ticketsFull.forEach((elem) => {
    arr.push(new Ticket(elem.id, elem.name, elem.status, elem.created));
  });
  return arr;
}

function findTicket(id) { // поиск заявки
  const result = ticketsFull.find((ticket) => ticket.id === id);
  return result;
}


app.use(async (ctx) => {
    console.log('request.query:', ctx.request.query);
    console.log('request.body', ctx.request.body);
    ctx.response.status = 204;

    console.log(ctx.response);
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
