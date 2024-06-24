import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChatbotService } from './chatbot.service';
import { AssistantRequest, ChatMessage } from './chatbot.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {

  plant: string = 'pes';

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  userInput: string = '';

  // Add loading and error variables
  loading: boolean = false;
  error: string | null = null;

  userImagePath = 'assets/img/Jim.png';
  botImagePath = 'assets/img/botImage.png';


  formattedResponse: SafeHtml = '';
  customErrorMessage: string | null = null;

  isLoading: boolean = false;
  errorOccurred: boolean = false;

  constructor(private sanitizer: DomSanitizer, private service: ChatbotService) { }

  ngOnInit() {
    this.messages.push({ text: "Hi, I'm MES Assistant! How can I help you today?", user: false });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {

    if (this.userInput.trim() === '') return;

    this.isLoading = true;

    // add user message to array
    this.messages.push({ text: this.userInput, user: true });

    // ask question to gpt
    let request = new AssistantRequest();
    request.inputs.plant.push(this.plant);
    request.inputs.question.push(this.userInput);

    this.service.askQuestion(request)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: (x) => {
        let result = x.predictions;
        console.log(result);
        this.messages.push({text: result[0], user: false});
      },
      error: (e) => {
        this.handleError(e);
      },
      complete: () => {
        console.log('databricks api call completed!');
      }
    });

    this.userInput = '';

  }

  handleError(errorMessage: string): void {
    this.customErrorMessage = errorMessage;
    this.errorOccurred = true; // Set error flag to true
  }

  private scrollToBottom(): void {
    try {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch (err) { }
  }

  autoGrow(event: any): void {
    const textArea = event.target;
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  // async getApiKey(): Promise<string> {
  //   try {
  //     const headers = new HttpHeaders({
  //       Authorization: `Bearer ${environment.authToken}`
  //     });

  //     const response = this.http.get<{ apiKey: string }>('/api/getApiKey', { headers });
  //     const data = await lastValueFrom(response);
  //     return data.apiKey || '';
  //   } catch (error) {
  //     console.error('Error fetching API key:', error);
  //     return '';
  //   }
  // }


  // async sendMessage() {
  //   if (this.userInput.trim() === '') return;

  //   this.messages.push({ text: this.userInput, user: true });

  //   this.messages.push({ text: 'Message Sent', user: false });

  //   // const userMessage = this.userInput;
  //   // const apiKey = await this.getApiKey(); // Retrieve the API key from the backend

  //   // if (!apiKey) {
  //   //   this.handleError('Failed to retrieve API key.');
  //   //   return;
  //   // }

  //   // const headers = new HttpHeaders({
  //   //   'Content-Type': 'application/json',
  //   //   'Authorization': `Bearer ${apiKey}`
  //   // });

  //   // const conversation = [
  //   //   { role: 'system', content: 'You are personable chatbot.' },
  //   //   { role: 'user', content: userMessage },
  //   // ];

  //   // this.isLoading = true;
  //   // this.errorOccurred = false;
  //   // this.customErrorMessage = '';

  //   // try {
  //   //   const response = await this.http.post(this.apiUrl, { model: 'gpt-4', messages: conversation }, { headers }).toPromise();

  //   //   if (response && 'choices' in response) {
  //   //     const apiResponse: ApiResponse = response as ApiResponse;
  //   //     const botResponse = apiResponse.choices[0].message.content.trim();

  //   //     // Push the bot's response to the messages array
  //   //     this.messages.push({ text: botResponse, user: false });

  //   //     // Format and set the response
  //   //     this.formattedResponse = this.formatCodeBlock(botResponse);
  //   //   } else {
  //   //     this.handleError("Invalid or empty response from the API.");
  //   //   }
  //   // } catch (error) {
  //   //   this.handleError("I'm experiencing technical difficulties at the moment. Please try again later.");
  //   //   console.error(error);
  //   // } finally {
  //   //   this.isLoading = false;
  //   // }
  //   this.userInput = ''; // Clear the input field
  // }

  

  // formatCodeBlock(code: string): SafeHtml {
  //   const formattedCode = this.sanitizer.bypassSecurityTrustHtml(`<pre><code>${code}</code></pre>`);
  //   return formattedCode;
  // }
}
// Define the ApiResponse type based on the expected structure
// interface ApiResponse {
//   choices: { message: { content: string } }[];
// }



