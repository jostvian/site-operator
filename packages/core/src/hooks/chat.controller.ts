import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { chatService } from '../services/chat.service';
import type { AppState, SuggestedPrompt } from '../models/chat.types';
import type { AppContext } from '../models/portal.types';



/**
 * Controlador reactivo para gestionar la conexión con el ChatService.
 * Se encarga de suscribirse a los cambios de estado y limpiar los recursos
 * cuando el componente host se desconecta.
 */
export class ChatController implements ReactiveController {
    private _host: ReactiveControllerHost;

    constructor(host: ReactiveControllerHost) {
        this._host = host;
        this._host.addController(this);
    }

    /**
     * Inicializa el servicio de chat con las URLs necesarias y el nombre de la aplicación.
     * @param config Configuración de inicialización.
     */
    initialize(config: { backendUrl: string, appName: string, conversationUrl: string, inspector?: boolean }) {
        return chatService.initialize(config);
    }

    /**
     * Se ejecuta cuando el componente se conecta al DOM.
     * Registra el listener para actualizaciones de estado.
     */
    hostConnected() {
        chatService.addEventListener('state-change', this._onStateChange);
    }

    /**
     * Se ejecuta cuando el componente se desconecta del DOM.
     * Elimina el listener para evitar fugas de memoria.
     */
    hostDisconnected() {
        chatService.removeEventListener('state-change', this._onStateChange);
    }

    /**
     * Retorna el estado actual del hilo de chat.
     */
    get isRunning() {
        return chatService.isRunning;
    }

    /**
     * Retorna el listado de mensajes.
     */
    get messages() {
        return chatService.messages;
    }

    /**
     * Retorna el listado de conversaciones recientes.
     */
    get conversations() {
        return chatService.conversations;
    }

    /**
     * Retorna los prompts sugeridos.
     */
    get suggestedPrompts() {
        return chatService.suggestedPrompts;
    }

    /**
     * Indica si se deben mostrar los prompts.
     */
    get showPrompts() {
        return chatService.showPrompts;
    }

    /**
     * Envía un mensaje a través del servicio.
     * @param content Contenido del mensaje.
     * @param role Rol del mensaje (opcional, por defecto 'user').
     */
    sendMessage(content: string, role: Parameters<typeof chatService.sendMessage>[1] = 'user') {
        return chatService.sendMessage(content, role);
    }

    /**
     * Inicia un nuevo hilo de charla.
     */
    startNewThread() {
        return chatService.startNewThread();
    }

    /**
     * Carga una conversación existente por su ID.
     * @param id ID de la conversación a cargar.
     */
    loadConversation(id: string) {
        return chatService.loadConversation(id);
    }

    /**
     * Establece el contexto de la aplicación.
     * @param context Objeto AgentState o AppContext con el contexto.
     */
    setAppContext(context: AppContext) {
        return chatService.setAppContext(context);
    }

    /**
     * Establece el estado dinámico de la aplicación.
     * @param state Objeto AppState.
     */
    setAppState(state: AppState) {
        return chatService.setAppState(state);
    }

    setAppLocation(location: AppState["location"]) {
        return chatService.setAppLocation(location);
    }

    setAppUI(ui: AppState["ui"]) {
        return chatService.setAppUI(ui);
    }

    setAppFocus(focus: AppState["focus"]) {
        return chatService.setAppFocus(focus);
    }

    /**
     * Establece los prompts sugeridos.
     * @param prompts Lista de prompts.
     */
    setSuggestedPrompts(prompts: SuggestedPrompt[]) {
        return chatService.setSuggestedPrompts(prompts);
    }

    /**
     * Oculta los prompts sugeridos.
     */
    hideSuggestedPrompts() {
        return chatService.hideSuggestedPrompts();
    }



    /**
     * Refresca el listado de conversaciones desde el servidor.
     */
    refreshConversations() {
        return chatService.refreshConversations();
    }

    /**
     * Obtiene el listado de conversaciones desde el servidor.
     */
    getConversations() {
        return chatService.getConversations();
    }

    /**
     * Manejador interno para cambios de estado.
     * Llama a requestUpdate() en el host para forzar el renderizado.
     */
    private _onStateChange = () => {
        this._host.requestUpdate();
    };
}
