
export class AssistantRequest {
    public inputs: AssistantInput = new AssistantInput();
}

export class AssistantResponse {
    public predictions: string[] = []; 
}

export interface ChatMessage {
  text: string;
  user: boolean;
}


class AssistantInput {
    public question: string[] = [];

    public plant: string[] = [];
}