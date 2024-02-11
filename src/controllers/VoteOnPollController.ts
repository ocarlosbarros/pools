import VoteOnPollRepository from "../repositories/VoteOnPollRepository";
import PollValidation from "../validations/PollValidation";
import VoteValidation from "../validations/VoteValidation";
import { randomUUID } from "crypto";

class VoteOnPollController {

    private _repository: VoteOnPollRepository;

    public constructor(repository: VoteOnPollRepository){     
        this._repository = repository;
    }

    public create = async (request: any, reply: any) => {

        const { pollId, pollOptionId } = VoteValidation.ValidateVote(request);

        let { sessionId } = request.cookies;

        if (sessionId){

            const userPreviousVoteOnPoll = await this._repository.getUserPreviousVote({ sessionId, pollId })

            if (userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId){
                await this._repository.deleteVote(userPreviousVoteOnPoll.id)
                
            } else if (userPreviousVoteOnPoll) {
                return reply.status(400).send({ message: 'You already voted on this poll!'});
            }
        }

        if (!sessionId){
            sessionId = randomUUID();

            reply.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 30, //30 days
                signed: true,
                httpOnly: true
            });
        }
        const vote = await this._repository.create({ sessionId, pollId, pollOptionId })

        return reply.status(201).send(vote);
    }
}

export default VoteOnPollController;