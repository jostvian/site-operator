import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { chatService } from '../services/chat.service';
import type { AgentState } from '../models/chat.types';

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
     * Inicializa el servicio de chat con una URL de backend.
     * @param config Configuración de inicialización.
     */
    /**
     * Inicializa el servicio de chat con una URL de backend y el nombre de la aplicación.
     * @param config Configuración de inicialización.
     */
    initialize(config: { backendUrl: string, appName: string }) {
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
    get thread() {
        return chatService.thread;
    }

    /**
     * Envía un mensaje a través del servicio.
     * @param content Contenido del mensaje.
     */
    sendMessage(content: string) {
        return chatService.sendMessage(content);
    }

    /**
     * Inicia un nuevo hilo de charla.
     */
    startNewThread() {
        return chatService.startNewThread();
    }

    /**
     * Establece el contexto de la aplicación.
     * @param context Objeto AgentState con el contexto.
     */
    setAppContext(context: AgentState) {
        return chatService.setAppContext(context);
    }

    /**
     * Manejador interno para cambios de estado.
     * Llama a requestUpdate() en el host para forzar el renderizado.
     */
    private _onStateChange = () => {
        this._host.requestUpdate();
    };
}
