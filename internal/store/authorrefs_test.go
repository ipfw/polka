package store

import (
	"reflect"
	"testing"
)

func TestParseAuthorRefs(t *testing.T) {
	got := parseAuthorRefs("3\x1fТолстой Лев\x1e7\x1f Ильф Илья \x1ebad\x1fX\x1e0\x1fY\x1e9\x1f  \x1e")
	want := []AuthorRef{{ID: 3, Name: "Толстой Лев"}, {ID: 7, Name: "Ильф Илья"}}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("got %#v, want %#v", got, want)
	}
	if refs := parseAuthorRefs(""); refs != nil {
		t.Errorf("empty: %#v", refs)
	}
}
