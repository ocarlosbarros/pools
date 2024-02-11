
import PollValidation from "../validations/PollValidation";
import PollRepository from "../repositories/PollRepository";
import { IPoll } from "../Interfaces/IPoll";

class PollController {
    
    private _repository: PollRepository;

    public constructor(repository: PollRepository){     
        this._repository = repository;
    }

    public create = async (request: any, reply: any) => {

    const { title, options} = PollValidation.titleIsString(request.body);

    const poll = await this._repository.create({ title, options });

    return reply.status(201).send({ pollId: poll.id });

    }

    public get = async (request: any, reply: any): Promise<string> => {

    const pollId = PollValidation.getValidParams(request.params);
        
        const poll = await this._repository.get(pollId);

        return reply.status(200).send(poll);
    }
}

export default PollController;