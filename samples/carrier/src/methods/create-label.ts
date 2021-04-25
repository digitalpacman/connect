import { requests, responses } from "@shipengine/connect-carrier-api";
import { logger, NotImplementedError } from "@shipengine/connect-runtime";


const mapRequest = (request: requests.CreateLabelRequest): any => { throw new NotImplementedError(); };
const callApi = async (request: any): Promise<any> => { throw new NotImplementedError(); };
const mapResponse = (response: any): responses.CreateLabelResponse => { throw new NotImplementedError(); };

export const CreateLabel = async (request: requests.CreateLabelRequest): Promise<responses.CreateLabelResponse> => {
    logger.info('This is a log that I can find using the `connect logs` command after publishing.')
    const thirdPartyRequest = mapRequest(request);
    const response = await callApi(thirdPartyRequest);
    const mappedResponse = mapResponse(response);
    return mappedResponse;
}
