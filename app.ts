import express , {Express , Request , Response} from "express"
import { Octokit } from "@octokit/rest";

const app : Express = express();

const octokit = new Octokit({
    auth : process.env.GITHUB_TOKEN,
    userAgent : "Pr-Summarise",
})

app.use(express.json());

app.post("/summarise", async (req : Request,res : Response) => {
    const event = req.headers["X-Github-Event"];

    if(event !== "pull_request"){
        res.status(200);
    }

    const action : string = req.body.action;
    const draft : boolean = req.body.pull_request.draft;
    const owner : string = req.body.repository.owner.login;
    const repo : string = req.body.repository.name;
    const pull_number : number = req.body.number;

    if(action === "opened" && !draft){
        const commits = await octokit.rest.pulls.listCommits({
            owner,
            repo,
            pull_number
        })

        console.log(commits)
    }

    res.status(200);
})

app.listen(3000,() => {
    console.log("Server is listening on port 3000")
})