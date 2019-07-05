/**
 * JQuery function to attach serialized form before submitting
 */
$(function() {
    $.extend(FormSerializer.patterns, {
        validate: /^[a-z][a-z0-9_]*(?:\.[a-z0-9_]+)*(?:\[\])?$/i
    });

    const $form = $("form.data-form");
    $form.submit(function(event) {

        const serialized = $form.serializeJSON();
        $form.append($('<input type="hidden" name="serializedForm">').val(serialized));


    });
});

