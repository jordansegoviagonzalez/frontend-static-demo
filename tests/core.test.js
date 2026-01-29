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
    let newSession = sessionService.createSession({ title: "Test Chat" });
    newSession = sessionService.saveSession(newSession); // Must save to persist
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
  it("should return message array with history", () => {
    const messages = [
      { role: "user", text: "Hello" },
      { role: "assistant", text: "Hi there" }
    ];
    const newPrompt = promptPolicy.buildPrompt({ previousMessages: messages, userText: "How are you?" });
    
    expect(newPrompt).to.be.an("array").that.has.lengthOf(3);
    expect(newPrompt[0]).to.deep.equal({ role: "user", content: "Hello" });
    expect(newPrompt[1]).to.deep.equal({ role: "assistant", content: "Hi there" });
    expect(newPrompt[2]).to.deep.equal({ role: "user", content: "How are you?" });
  });
});
