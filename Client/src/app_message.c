#include <pebble.h>

Window *window;
ActionBarLayer *action_bar;
static GBitmap *up_icon;
static GBitmap *down_icon;
static GBitmap *play_icon;

static GBitmap *background_image;
static BitmapLayer *background_layer;

TextLayer *text_layer;
// Key values for AppMessage Dictionary
enum
{
    STATUS_KEY = 0,
    MESSAGE_KEY = 1
};

//Send space message to Javascript. 
void press_space(void)
{
    DictionaryIterator *iter;
    
    app_message_outbox_begin(&iter);
    dict_write_uint8(iter, STATUS_KEY, 0x1);
    dict_write_cstring(iter, MESSAGE_KEY, "space");
    
    dict_write_end(iter);
    app_message_outbox_send();
}

//Send up message to Javascript. 
void press_up(void)
{
    DictionaryIterator *iter;
    
    app_message_outbox_begin(&iter);
    dict_write_uint8(iter, STATUS_KEY, 0x1);
    dict_write_cstring(iter, MESSAGE_KEY, "up");
    
    dict_write_end(iter);
    app_message_outbox_send();
}

//Send down message to Javascript. 
void press_down(void)
{
    DictionaryIterator *iter;
    
    app_message_outbox_begin(&iter);
    dict_write_uint8(iter, STATUS_KEY, 0x1);
    dict_write_cstring(iter, MESSAGE_KEY, "down");
    
    dict_write_end(iter);
    app_message_outbox_send();
}

void select_click_handler(ClickRecognizerRef recognizer, void *context)
{
    press_space();
}

void down_click_handler(ClickRecognizerRef recognizer, void *context)
{
    press_down();
}

void up_click_handler(ClickRecognizerRef recognizer, void *context)
{
    press_up();
}


void config_provider(void *context)
{
    
    window_single_click_subscribe(BUTTON_ID_SELECT, select_click_handler);
    
    window_single_repeating_click_subscribe(BUTTON_ID_DOWN,100, down_click_handler);
    
    window_single_repeating_click_subscribe(BUTTON_ID_UP,100, up_click_handler);
    
}


// Write message to buffer & send


// Called when a message is received from PebbleKitJS
static void in_received_handler(DictionaryIterator *received, void *context)
{
    Tuple *tuple;
    
    tuple = dict_find(received, STATUS_KEY);
    if(tuple)
    {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received Status: %d", (int)tuple->value->uint32);
    }
    
    tuple = dict_find(received, MESSAGE_KEY);
    if(tuple)
    {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received Message: %s", tuple->value->cstring);
		text_layer_set_text(text_layer, tuple->value->cstring);
    }
}

// Called when an incoming message from PebbleKitJS is dropped
static void in_dropped_handler(AppMessageResult reason, void *context)
{
}

// Called when PebbleKitJS does not acknowledge receipt of a message
static void out_failed_handler(DictionaryIterator *failed, AppMessageResult reason, void *context)
{
}

void init(void)
{
    window = window_create();
    window_stack_push(window, true);
	
	Layer *window_layer = window_get_root_layer(window);
    GRect bounds = layer_get_frame(window_layer);
    // Register AppMessage handlers
    app_message_register_inbox_received(in_received_handler);
    app_message_register_inbox_dropped(in_dropped_handler);
    app_message_register_outbox_failed(out_failed_handler);
    
    app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());
    
	
	background_image = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_BACKGROUND_WHITE);
	background_layer = bitmap_layer_create(layer_get_frame(window_layer));
    bitmap_layer_set_bitmap(background_layer, background_image);
    layer_add_child(window_layer, bitmap_layer_get_layer(background_layer));
	
	 action_bar = action_bar_layer_create();
 	 // Associate the action bar with the window:
 	 action_bar_layer_add_to_window(action_bar, window);
	
	 up_icon = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_UP_WHITE);
	 down_icon = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_DOWN_WHITE);
	 play_icon = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_PLAY5_WHITE);
 	 // Set the click config provider:
	
 	 action_bar_layer_set_click_config_provider(action_bar, config_provider);
	
	
	 action_bar_layer_set_icon(action_bar, BUTTON_ID_UP, up_icon);
	 action_bar_layer_set_icon(action_bar, BUTTON_ID_DOWN, down_icon);
	 action_bar_layer_set_icon(action_bar, BUTTON_ID_SELECT, play_icon);
	
	
	
	text_layer = text_layer_create((GRect){ .origin = { 0, 0 }, .size = { 144,60 } });
	text_layer_set_font(text_layer, fonts_get_system_font(FONT_KEY_GOTHIC_28_BOLD));
	text_layer_set_text(text_layer, "Connecting");
	text_layer_set_background_color(text_layer, GColorClear);
	layer_add_child(window_layer, text_layer_get_layer(text_layer));
	
    //Register click handler
    //window_set_click_config_provider(window, (ClickConfigProvider) config_provider);
}

void deinit(void)
{
    app_message_deregister_callbacks();
    window_destroy(window);
}

int main( void )
{
    init();
    app_event_loop();
    deinit();
}