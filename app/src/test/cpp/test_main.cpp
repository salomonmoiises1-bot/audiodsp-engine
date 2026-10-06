#include "test_framework.h"

int main() {
    return eqsb::test::TestRegistry::instance().runAll();
}
