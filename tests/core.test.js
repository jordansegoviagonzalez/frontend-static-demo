import { sessionService } from "../assets/js/core/sessionService.js";
import { promptPolicy } from "../assets/js/core/promptPolicy.js";

const expect = chai.expect;

describe("Core: Session Service", () => {
  
  // Clean up before each test
  beforeEach(() => {
    localStorage.clear();
  });

  it("should create a new session with a default title", () => {
    const session = sessionService.createSession();
    expect(session).to.have.property("id");
    expect(session.title).to.equal("New chat");
    expect(session.messages).to.be.an("array").that.is.empty;
  });

  it("should save and retrieve a session", () => {
    const newSession = sessionService.createSession({ title: "Test Chat" });
    const retrieved = sessionService.getSessionById(newSession.id);
    expect(retrieved).to.deep.equal(newSession);
  });

  it("should delete a session", () => {
    const session = sessionService.createSession();
    sessionService.deleteSession(session.id);
    const result = sessionService.getSessionById(session.id);
    expect(result).to.be.null;
  });
});

describe("Core: Prompt Policy", () => {
  it("should format the prompt correctly for Gemma", () => {
    const messages = [
      { role: "user", text: "Hello" },
      { role: "assistant", text: "Hi there" }
    ];
    const newPrompt = promptPolicy.buildPrompt({ previousMessages: messages, userText: "How are you?" });
    
    // We expect the standard chat format
    expect(newPrompt).to.include("<start_of_turn>user\nHello<end_of_turn>");
    expect(newPrompt).to.include("<start_of_turn>model\nHi there<end_of_turn>");
    expect(newPrompt).to.include("<start_of_turn>user\nHow are you?<end_of_turn>");
  });
});
