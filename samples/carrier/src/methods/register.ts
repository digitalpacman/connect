import { requests, responses } from "@shipengine/connect-carrier-api";
import { logger, NotImplementedError } from "@shipengine/connect-runtime";


const mapRequest = (request: requests.RegisterRequest): any => { throw new NotImplementedError(); };
const callApi = async (request: any): Promise<any> => { throw new NotImplementedError(); };
const mapResponse = (response: any): responses.RegisterResponse => { throw new NotImplementedError(); };

export const Register = async (request: requests.RegisterRequest): Promise<responses.RegisterResponse> => {
    logger.info('This is a log that I can find using the `connect logs` command after publishing.')
    const thirdPartyRequest = mapRequest(request);
    const response = await callApi(thirdPartyRequest);
    const mappedResponse = mapResponse(response);
    return mappedResponse;
}
