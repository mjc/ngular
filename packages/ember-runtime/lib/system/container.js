import { set } from "ngular-metal/property_set";
import Registry from "container/registry";
import Container from "container/container";

Registry.set = set;
Container.set = set;

export { Registry, Container };
