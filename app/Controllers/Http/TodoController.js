const User = use("App/Models/User");
const Todo = use("App/Models/Todo");
const uuid = use("uuid/v4");
const moment = use('moment');

class TodoController {
    async display({request, response, view }) {
        const todos = await Todo.find();
        if(!todos)  return view.render("dashboard.todo.todo", {email: request.params.email});
        const dates = []
        let infos = [];
        let defaultMonth;
        await todos.forEach(async todo => {
            await todo.todo_info.forEach(info => {
                dates.push(moment(info.date).format("MM-YYYY"));
                if(moment(todo.created_at).format("MM-YYYY")) {
                    const payload = {
                        _id: todo._id,
                        name: todo.user_details.name,
                        email: todo.user_details.email,
                        phone: todo.user_details.phone,
                        infos: info,

                    }
                    infos.push(payload);
                }
            })
        })
        let uniqueDates = dates.filter((date, pos) => {
            return dates.indexOf(date) == pos;
        })
        infos.sort((prev, next) => {
            return new Date(prev.infos.todoDate) - new Date(next.infos.todoDate)
        })
        if(!infos.length){
            defaultMonth = "Please Add Todo List.";
            return view.render("dashboard.todo.todo", {email: request.params.email,defaultMonth, uniqueDates})
        }
        else {
            defaultMonth = moment().format("MM-YYYY");
            return view.render("dashboard.todo.todo", {email: request.params.email,defaultMonth, uniqueDates, infos})

        }
       
    }

    async getTodo({request, response }) {
        const todos = await request.find();
        if(!todos) return response.status(500).json({ msg: "There is no todo list."});
        return response.status(200).json({todos});
    }
    async addTodo ({ request, response, auth }) {
        const user = await auth.getUser();
        const data = await request.only(["desc", "todoDate", "todoTime", "venue", "about"]);
        if(!user) return response.status(500).json({ msg: "Something went wrong. Please contact support"});
        const todos = await Todo.findOne({"user_details.email": user.email});
        if(!todos) {
            const payload = {
                user_details: {
                    name: user.name,
                    email: user.email,      
                    phone: user.phone,
                },
                todo_info: [{
                        desc: data.desc,
                        id: uuid(),
                        todoDate: moment(data.todoDate).format("DD-MM-YYYY"),
                        todoTime: data.todoTime,
                        date: moment().format('DD-MM-YYYY'),
                        todoAbout: data.about,
                        todoVenue: data.venue,
                }]
            }
            const todo = await Todo.create(payload);
        } else {
            const payload = {
                desc: data.desc,
                id: uuid(),
                todoDate: moment(data.todoDate).format("DD-MM-YYYY"),
                date: moment().format('DD-MM-YYYY'),
                todoTime: data.todoTime,
                todoAbout: data.about,
                todoVenue: data.venue,
            }
            todos.todo_info.push(payload);
            await todos.markModified("todo_info");
            await todos.save();
        }

        return response.status(200).json({ todos });
    }

    async deleteTodo({request, response }) {
        const data = await request.only(["id", "todoID"]);
        let todo = await Todo.findOne({_id: data.id});
        if(!todo) return response.status(500).json({msg: "Error: Please contact support"});

        let newTodos = [];
        let i = 0;
        for(i=0;i<todo.todo_info.length; i++) {
            if(todo.todo_info[i].id == data.todoID) {
                delete todo.todo_info[i];
            } else {
                let payload = {
                    desc: todo.todo_info[i].desc,
                    id: todo.todo_info[i].id,
                    todoDate:  todo.todo_info[i].todoDate,
                    todoTime: todo.todo_info.todoTime,
                    date:  todo.todo_info[i].date,
                }

                newTodos.push(payload)
            }
        }
        todo.todo_info = newTodos;
        await todo.markModified("todo_info");
        await todo.save();

        return response.status(200).json({msg: "Successfully deleted."});
    }
}


module.exports = TodoController;