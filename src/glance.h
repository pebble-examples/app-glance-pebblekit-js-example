#include <pebble.h>

static void prv_lockitron_toggle_state();
static void prv_inbox_received_handler(DictionaryIterator *iter, void *context);
static void prv_exit_delay();
static void prv_exit_application(void *data);
static void prv_init_app_message();
static void prv_init(void);
static void prv_deinit(void);
static void prv_window_load(Window *window);
static void prv_window_unload(Window *window);